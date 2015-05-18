package ee;

import org.apache.wicket.ajax.AbstractDefaultAjaxBehavior;
import org.apache.wicket.ajax.AjaxRequestTarget;
import org.apache.wicket.ajax.AjaxSelfUpdatingTimerBehavior;
import org.apache.wicket.behavior.AbstractAjaxBehavior;
import org.apache.wicket.behavior.AttributeAppender;
import org.apache.wicket.markup.html.WebMarkupContainer;
import org.apache.wicket.markup.html.internal.HtmlHeaderContainer;
import org.apache.wicket.model.LoadableDetachableModel;
import org.apache.wicket.request.IRequestHandler;
import org.apache.wicket.request.Response;
import org.apache.wicket.request.cycle.RequestCycle;
import org.apache.wicket.request.handler.TextRequestHandler;
import org.apache.wicket.request.http.WebRequest;
import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.util.time.Duration;

import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;

public class HomePage extends WebPage {
	// private static final Log log = LogFactory.getLog(HomePage.class);
	private static final long serialVersionUID = 1L;

	public HomePage(final PageParameters parameters) {
		super(parameters);

		WebMarkupContainer cmdSimulate;
		add(cmdSimulate = new WebMarkupContainer("cmdSimulate"));
		final AbstractDefaultAjaxBehavior beh = new AbstractDefaultAjaxBehavior() {
			@Override
			protected void respond(AjaxRequestTarget ajaxRequestTarget) {
				System.out.println("Wywołałem z argumentami: " + getRequestCycle().getRequest().getPostParameters());
				Response response = getRequestCycle().getResponse();
				response.write("{\"jsonKey\":\"jsonValue\"}");
			}
		};
		cmdSimulate.add(beh);
		cmdSimulate.add(new AttributeAppender("onclick", new LoadableDetachableModel<String>() {
			@Override
			protected String load() {
				return "callSimulate('" + beh.getCallbackUrl() + "'); return false;";
			}
		}));

		WebMarkupContainer cmdSimulateJson;
		add(cmdSimulateJson = new WebMarkupContainer("cmdSimulateJson"));
		final AbstractAjaxBehavior ab = new AbstractAjaxBehavior() {
			@Override
			public void onRequest() {
				//get parameters
				final RequestCycle requestCycle = RequestCycle.get();


				WebRequest wr= (WebRequest)requestCycle.getRequest();

				HttpServletRequest hsr= (HttpServletRequest) wr.getContainerRequest();

				try {
					BufferedReader br = hsr.getReader();

					String  jsonString = br.readLine();
					if((jsonString==null) || jsonString.isEmpty()){
						System.out.println(" no json found");
					}
					else {
						System.out.println(" json  is :" + jsonString);
					}



				} catch (IOException ex) {
					System.out.println(ex);
				}


				// json string to retir to the jQuery onSuccess function
				String data= "{'res':'cosik'}";

				System.out.println("returning json :" + data);

				IRequestHandler t = new TextRequestHandler("application/json", "UTF-8", data);
				getRequestCycle().replaceAllRequestHandlers(t);
			}
		};
		cmdSimulateJson.add(ab);
		cmdSimulateJson.add(new AttributeAppender("onclick", new LoadableDetachableModel<String>() {
			@Override
			protected String load() {
				return "callSimulateJson('" + ab.getCallbackUrl() + "'); return false;";
			}
		}));


		cmdSimulate.add(new AjaxSelfUpdatingTimerBehavior(Duration.seconds(1000)){

			@Override
			protected void onPostProcessTarget(AjaxRequestTarget target) {
				super.onPostProcessTarget(target);
				System.out.println("timer..");


			}
		});
    }

	@Override
	public void renderHead(HtmlHeaderContainer container) {
		super.renderHead(container);

	}
}
